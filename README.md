# node-red-contrib-custom-chatgpt

![Platform](https://img.shields.io/badge/platform-Node--RED-red)
![npm](https://img.shields.io/npm/v/node-red-contrib-custom-chatgpt.svg)
![Downloads](https://img.shields.io/npm/dt/node-red-contrib-custom-chatgpt.svg)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

Supercharge your Node-RED flows with AI! Seamlessly integrate with OpenAI's powerful models like GPT-4 and DALL·E 2, and unlock a world of creative possibilities. Create imaginative chatbots, automate content generation, or build AI-driven experiences. The power of AI is just a node away!

## Table of Contents

- [node-red-contrib-custom-chatgpt](#node-red-contrib-custom-chatgpt)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Parameter Examples](#parameter-examples)
    - [Additional optional properties](#additional-optional-properties)
  - [Examples](#examples)
  - [External Links](#external-links)
  - [Bugs and Feature Requests](#bugs-and-feature-requests)
  - [Changelog](#changelog)
  - [License](#license)

## Getting Started

To start using `node-red-contrib-custom-chatgpt`, you can install it through the built-in Node-RED Palette manager or using npm:

```sh
npm install node-red-contrib-custom-chatgpt
```

## Setup

- [Follow this guide to get your OpenAI API key](https://platform.openai.com/account/api-keys)
- [Here's how to get your Organization ID](https://platform.openai.com/account/org-settings)

With these, you're ready to configure your `node-red-contrib-custom-chatgpt` nodes.

## Usage

With `node-red-contrib-custom-chatgpt`, you have the power to select the behavior of the node by setting the Topic property value to `completion`, `image`, `edit`, `turbo` , or `gpt4`. You can control the node with a single required message property `msg.payload` or dynamically set the behavior with incoming messages using `read from msg.topic`.

For detailed information on the usage of these modes, please refer to the [OpenAI API documentation](https://beta.openai.com/docs/).

| `msg.topic`   | Required Parameters | Optional Parameters |
| ------------ | -------------------- | -------------------- |
| `completion` | `msg.payload`: A thoughtfully composed prompt supplying adequate detail for the model. | N/A |
| `image`      | `msg.payload`: A descriptive text prompt articulating the desired image. | `msg.size`: A string indicating the desired image dimensions. [Default:`256x256`] <br> `msg.format`: A string—either `b64_json` or `url`. [Default:`b64_json`] |
| `edit`       | `msg.payload`: A text prompt serving as a starting point for the edit. <br> `msg.last`: A string providing the text input that is to be edited. | N/A |
| `turbo`      | `msg.payload`: A well-constructed prompt supplying sufficient detail for the model. | `msg.history`: An array of objects encapsulating the conversation history. [Default:`[]`] |
| `gpt4`       | `msg.payload`: A thoroughly prepared prompt offering enough context for the model. | `msg.history`: An array of objects recording the conversation history. [Default:`[]`] <br> `msg.functions`: An array of objects dictating function behaviors for the model. Each object must contain a `name` and `behavior` attribute. [Default:`[]`] <br> `msg.function_call`: A string or object regulating the model's responses to function calls. [Default:`none` if no functions, `auto` if functions are present] |

### Parameter Examples

- `completion`:

```javascript
msg.topic = "completion";
msg.payload = "Write a brief summary of the book 'To Kill a Mockingbird'.";
return msg;
```

- `image`:

```javascript
msg.topic = "image";
msg.payload = "Generate an image of a sunny beach.";
msg.size = "512x512";
msg.format = "url";
return msg;
```

- `edit`:

```javascript
msg.topic = "edit";
msg.payload = "Fix the spelling mistakes";
msg.last = "The quick fox jumps over the lazzy dog.";
return msg;
```

- `turbo`:

```javascript
msg.topic = "turbo";
msg.payload = "Translate the following English text to French: 'Hello, how are you?'";
msg.history = [];
return msg;
```

- `gpt4`:

```javascript
msg.topic = "gpt4";
msg.payload = "Write a poem about the sunrise.";
msg.history = [];
msg.functions = [];
return msg;
```

### Additional optional properties

The following optional inputs are supported - `msg.max_tokens`, `msg.suffix`, `msg.n`, `msg.temperature`, `msg.top_p`, `msg.presence_penalty`, `msg.frequency_penalty`, and `msg.echo`. See the nodes built-in help tab for more information on how they are used.

## Examples

We've provided several examples to help you understand the potential and versatility of `node-red-contrib-custom-chatgpt`. From basic usages like image generation and text editing, to more advanced features like setting behaviors, using optional message properties, and automating Node-RED node creation.

[Old screenshot] Basic usage for image, completion, and edit.
[![Screenshot showcasing basic usage of node-red-contrib-custom-chatgpt for image generation, text completion, and text editing tasks](/examples/example.png)](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/blob/main/examples/chatgpt.json)

[Old screenshot] More advanced usage with templates.
[![Screenshot illustrating advanced usage of node-red-contrib-custom-chatgpt with templates](/examples/example2.png)](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/blob/main/examples/chatgpt.json)

[Old screenshot] Usage of model `gpt-3.5-turbo` and conversation history.
[![Screenshot demonstrating the usage of `gpt-3.5-turbo` model with conversation history in node-red-contrib-custom-chatgpt](/examples/example3.png)](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/blob/main/examples/chatgpt.json)

[New screenshot] Updated example using optional message properties and setting behavior `Topic` in node edit dialog.
[![Screenshot of an updated example showing the use of optional message properties and setting behavior `Topic` in node edit dialog with node-red-contrib-custom-chatgpt](/examples/example4.png)](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/blob/main/examples/chatgpt.json)

[New screenshot] Additional example demonstrating how to generate Node-RED nodes and import them directly into the editor automatically.
[![Screenshot of an additional example demonstrating the generation of Node-RED nodes and their automatic import into the editor using node-red-contrib-custom-chatgpt](/examples/example5.png)](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/blob/main/examples/generate-node-red-nodes.json)

## External Links

- [Node-RED](https://flows.nodered.org/node/node-red-contrib-custom-chatgpt)
- [Libraries.io](https://libraries.io/npm/node-red-contrib-custom-chatgpt)
- [npm](https://www.npmjs.com/package/node-red-contrib-custom-chatgpt)

## Bugs and Feature Requests

Encountered a bug or have an idea for a new feature? We'd love to hear from you! Feel free to [submit an issue](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/issues) on our GitHub page.

## Changelog

Stay up-to-date with the latest changes by checking out our [CHANGELOG](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/blob/main/CHANGELOG.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
