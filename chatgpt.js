const { Configuration, OpenAIApi } = require("openai");

module.exports = (RED) => {
    // Define the different actions for different topics that are accepted by the chatbot
    // Each action consists of two parts: a function for the specific OpenAI API call, and a transform function to process the API response.
    const actions = {
        'image': {
            func: (openai, msg) => openai.createImage({
                prompt: msg.payload,
                n: parseInt(msg.n) || 1,
                size: msg.size || '256x256',
                response_format: msg.format || 'b64_json',
            }),
            transform: (msg, response) => {
                if (msg.format === 'url') {
                    msg.payload = response.data.data[0].url;
                } else {
                    msg.payload = response.data.data[0].b64_json;
                }
                msg.full = response;
            }
        },
        'edit': {
            func: (openai, msg) => openai.createEdit({
                model: 'text-davinci-edit-001',
                instruction: msg.payload,
                n: parseInt(msg.n) || 1,
                input: msg.last || '',
                temperature: parseInt(msg.temperature) || 1,
                top_p: parseInt(msg.top_p) || 1,
            }),
            transform: (msg, response) => {
                msg.payload = response.data.choices[0].text;
                msg.full = response;
            }
        },
        'turbo': {
            func: (openai, msg) => {
                if (typeof msg.history === 'undefined') msg.history = [];
                const input = {
                    role: 'user',
                    content: msg.payload,
                };
                msg.history.push(input);
                return openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: msg.history,
                    temperature: parseInt(msg.temperature) || 1,
                    top_p: parseInt(msg.top_p) || 1,
                    n: parseInt(msg.n) || 1,
                    stream: msg.stream || false,
                    stop: msg.stop || null,
                    max_tokens: parseInt(msg.max_tokens) || 4000,
                    presence_penalty: parseInt(msg.presence_penalty) || 0,
                    frequency_penalty: parseInt(msg.frequency_penalty) || 0,
                });
            },
            transform: (msg, response) => {
                const trimmedContent = response.data.choices[0].message.content.trim();
                const result = {
                    role: 'assistant',
                    content: trimmedContent,
                };
                msg.history.push(result);
                msg.payload = response.data.choices[0].message.content;
                msg.full = response;
            }
        },
        'gpt4': {
            func: (openai, msg) => {
                if (typeof msg.history === 'undefined') msg.history = [];

                // Payload is optional. If it is omitted, assume the caller has
                // modified history on their own.
                if (msg.payload) {
                    const input = {
                        role: 'user',
                        content: msg.payload,
                    };
                    msg.history.push(input);
                }

                const params = {
                    model: 'gpt-4-0613',
                    messages: msg.history,
                    temperature: parseInt(msg.temperature) || 1,
                    top_p: parseInt(msg.top_p) || 1,
                    n: parseInt(msg.n) || 1,
                    stream: msg.stream || false,
                    stop: msg.stop || null,
                    max_tokens: parseInt(msg.max_tokens) || 4000,
                    presence_penalty: parseInt(msg.presence_penalty) || 0,
                    frequency_penalty: parseInt(msg.frequency_penalty) || 0,
                };

                if (msg.functions && msg.functions.length > 0) {
                    params.functions = msg.functions;
                    params.function_call = msg.function_call ?? 'auto';
                }

                return openai.createChatCompletion(params);
            },
            transform: (msg, response) => {
                if(response.data.choices[0].message.content !== null) {
                    const trimmedContent = response.data.choices[0].message.content.trim();
                    const result = {
                        role: 'assistant',
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    msg.payload = response.data.choices[0].message.content;
                    msg.full = response;
                } else {
                    // The content is null, indicating that a function call is necessary
                    msg.function_call = response.data.choices[0].message.function_call;
                    const args = msg.function_call.arguments;

                    //  if arguments is not a string, json stringify it
                    if (typeof args !== 'string') {
                        args = JSON.stringify(args);
                    }

                    const result = {
                        role: 'assistant',
                        content: null,
                        function_call: {
                            name: msg.function_call.name,
                            arguments: args
                        }
                    };
                    msg.history.push(result);
                    msg.payload = null;
                    msg.full = response;
                }
            }
        },
        'completion': {
            func: (openai, msg) => openai.createCompletion({
                model: 'text-davinci-003',
                prompt: msg.payload,
                suffix: msg.suffix || null,
                max_tokens: parseInt(msg.max_tokens) || 4000,
                temperature: parseInt(msg.temperature) || 1,
                top_p: parseInt(msg.top_p) || 1,
                n: parseInt(msg.n) || 1,
                stream: msg.stream || false,
                logprobs: parseInt(msg.logprobs) || null,
                echo: msg.echo || false,
                stop: msg.stop || null,
                presence_penalty: parseInt(msg.presence_penalty) || 0,
                frequency_penalty: parseInt(msg.frequency_penalty) || 0,
                best_of: parseInt(msg.best_of) || 1,
            }),
            transform: (msg, response) => {
                msg.payload = response.data.choices[0].text;
                msg.full = response;
            }
        }
    };

    // Function to create an OpenAI instance
    function createOpenAIInstance (config) {
        const API_KEY = config.API_KEY;
        const ORGANIZATION = config.Organization;
        const configuration = new Configuration({
            organization: ORGANIZATION,
            apiKey: API_KEY,
        });

        if (config.BaseUrl) {
            try {
                const url = new URL(config.BaseUrl);
                if (url.pathname === "/") {
                    url.pathname = "/v1";
                }
                configuration.basePath = url.toString();
            } catch {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `BaseUrl(${config.BaseUrl}) isn't a valid url`,
                });
            }
        }

        return new OpenAIApi(configuration);
    }

    // Function to handle errors during OpenAI API calls
    function handleError (error, msg, node) {
        node.status({
            fill: "red",
            shape: "dot",
            text: "Error",
        });
        if (error.response) {
            node.error(error.response.status, msg);
            node.error(error.response.data, msg);
        } else {
            node.error(error.message, msg);
        }
    }

    // Main function to create a Node-RED node and set its functionality
    function main (config) {
        const node = this;
        RED.nodes.createNode(node, config);
        const openai = createOpenAIInstance(config);

        node.on("input", async (msg) => {
            node.status({
                fill: "green",
                shape: "dot",
                text: "Processing...",
            });
            if (config.topic != "__EMPTY__") {
                msg.topic = config.topic;
            }
            if (msg.topic) {
                msg.topic = msg.topic.toLowerCase();
            }

            const action = actions[msg.topic];
            if (!action) {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "msg.topic is incorrect",
                });
                node.error(
                    `msg.topic must be a string set to one of the following values: ${Object.keys(actions).map(
                        (item) => `'${item}'`
                    ).join(", ")}`
                );
                node.send(msg);
                return;
            }

            // Call the OpenAI API and process the response
            try {
                const response = await action.func(openai, msg);
                action.transform(msg, response);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "Response complete",
                });
                node.send(msg);
            } catch (error) {
                handleError(error, msg, node);
            }
        });

        node.on("close", () => {
            node.status({});
        });
    };

    RED.nodes.registerType("chatgpt", main);
};
