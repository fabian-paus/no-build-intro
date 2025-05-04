# No Build: Making Javascript (and TypeScript) Fun Again

I used to be a C++ developer, where long compile times were the norm.
The web and Javascript seemed almost magical with their ability to run instantly.
But nowadays, we have added long build steps to web development again.

The idea behind
[TypeScript](https://www.typescriptlang.org/)
and all its "typed" Javascript predecessors was the introduction of type checking
into the dynamic mess that is Javascript.
The ambitious goal was to allow for bigger software teams to collaborate on a single code base,
make refactoring easier and ensure that errors are detected as early as possible.
However, this came at a cost.
Javascript is usually run by a browser to customize a web page or by
[Node.js](https://nodejs.org/en)
on server.
To execute your TypeScript program, you need to first compile the TypeScript code back to Javascript using a compiler like
[tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

While type checking is great and definitely achieves some of the outlined goals,
it also makes the edit-compile-test cycle significantly longer.
In a large TypeScript project it might happen that you now need to dedicate engineering effort
to improve the compilation time.
We have cycled back to the old C++ world, where compile speeds are slow and life is miserable.

There is another often overlooked disadvantage of requiring a compilation step.
Your application can now longer be "just" executed or deployed.
If something in the JavaScript ecosystem breaks or changes significantly,
you might no longer be able to install the required tools to compile your application.
In order to run your program, the following other programs need to still work:

- [npm](https://www.npmjs.com/) or any other package manager is used to install the TypeScript compiler
- [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html): The TypeScript to Javascript compiler
- [Node.js](https://nodejs.org/) or any other Javascript runtime

The somewhat recent "No Build" trend tries to counteract this
by emphasising that we can still build modern web application without a giant build machinery.
How can we make Javascript run without a build step while still maintaining the type safety of TypeScript?
How can we even run TypeScript code itself without a build step?

And most importantly: How can we make it fun again?

## What is No Build?

No Build refers to the practice of writing Javascript applications without a build system.
This means that you avoid all the build tools that have become common and sometimes required to build web applications
including:

- Typechecking and translating TypeScript into Javascript, e.g. [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- Bundling multiple Javascript files into a single file, e.g. [webpack](https://webpack.js.org/)
- [Minification](https://developer.mozilla.org/en-US/docs/Glossary/Minification), i.e. shortening the Javascript code by replacing names with a few letters, etc.
- Adding [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) to support older browsers
- [Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking), i.e. removing unused code
- Building CSS, e.g. [tailwind](https://tailwindcss.com/)

### The Origins of No Build

The history of the No Build concept is a bit tricky.
You have to remember that we used to always build web applications without build systems.
The paradigm shift to increasingly complex build systems started with the growing complexity of web applications.
So it is not like No Build was invented, it was merely remembered.

The term No Build and the associated concepts became a bit viral during the end of 2023.
I first heard about it from David Heinemeier Hansson (DHH), the inventor of Ruby on Rails.
You can read his
[blog post](https://world.hey.com/dhh/you-can-t-get-faster-than-no-build-7a44131c)
about the topic or watch this [interview](https://www.youtube.com/watch?v=mTa2d3OLXhg&t=3000s)
where he discusses the concept and its benefits.

Some other blog posts that are worth a read if you became interested in the topic:

- [Writing Javascript without a build system](https://jvns.ca/blog/2023/02/16/writing-javascript-without-a-build-system/) by Julia Evans
- [Going Buildless](https://mxb.dev/blog/buildless/) by Max Böck

### Benefits and Drawbacks of No Build

We already discussed some benefits of the No Build approach.
But it is worthwhile to think a little bit outside the box as well:

- **Learning**: I think one of the greatest benefits of No Build is that new people can very easily check out how you implemented your website. Think of a student who thinks your website is awesome, opens the source, and can just start to understand how the code works. No minification, bundling or other obfuscations are in the way. This enables a new generation of web developers to discover and learn from our projects.

- **Longevity**: There was a time when websites where made to last forever.
  Even today, browser try very hard to render old websites with all their quirks.
  But somehow, we reached a point where you need to update your Framework of choice every few months to keep things working.
  If you missed a few major version, good luck to you fixing your application until builds and probably even longer until you found all the hidden behavior changes.
  No Build gives your projects longevity. You do not need to update them every few months.
  They work now, in 5 years and probably also in 20 years.

- **Battling Complexity**: We as software developers battle complexity all day.
  I would argue that our main task to conquer complexity to make our system easier to maintain and expand with new features.
  The complexity of a build system does not come from the actual problem that your are solving.
  It is added complexity that needs your attention every time something breaks or needs a major version update.
  Solving these issues does not add any value to your product. It is just accidental complexity.

The drawbacks of No Build are also apparent:

- **Manual Work**: Build tools and steps exists for a reason.
  They have solved a real existing problem, e.g. bundling made websites load much faster compared to downloading hundreds of Javascript files.
  However, a lot of these problems have been solved with new web technology.
  For example, downloading hundreds of Javscript files used to be very slow with HTTP 1.0, since every file required a new connection.
  With newer HTTP versions, the browser can keep the connection alive and the server can even start sending the files before the client requested them.
  We should take critical look at our build tools and verify that their value still outweighs their drawbacks.
- **Losing Familiarity**: New web developers are used to web frameworks, TypeScript, bundling, minification and so on.
  Getting familiar with and evaluating the alternatives takes time that is often not available in the modern "Agile" world, where you hustle from one sprint to the next.
  Nevertheless, I think we should take the time to evaluate new concepts.
  Even if, in the end, we decide not to use them.

## Type Checking for JavaScript

[TypeScript](https://www.typescriptlang.org/) purpose is to add type checking to Javascript.
It enables us to catch type errors at compile time before running our program.
However, we can actually use the same type checker for vanilla Javascript as we can for TypeScript.
We just need to annotate our types using a different syntax,
[JSDoc](https://jsdoc.app/)!

Let me show you some TypeScript examples and their equivalent in JSDoc.

### Examples

A TypeScript interface:

```TypeScript
interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  current: CurrentWeather;
  hourly: WeatherSeries;
}
```

A JSDoc type definition:

```js
/**
 * @typedef {Object} WeatherData
 * @property {number} latitude - The latitude of the location.
 * @property {number} longitude - The longitude of the location.
 * @property {number} elevation - The elevation of the location.
 * @property {CurrentWeather} current - The current weather data.
 * @property {WeatherSeries} hourly - The hourly weather data series.
 */
```

A TypeScript variable:

```TypeScript
let weather: WeatherData;
```

A JSDoc variable annotation:

```js
/** @type {WeatherData} */
let weather;
```

A TypeScript function:

```TypeScript
async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData>
```

A JSDoc function annotation:

```js
/**
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<WeatherData>}
 */
async function getWeather(latitude, longitude)
```

### Enable Type Checking for JSDoc

Most IDEs will automatically parse JSDoc annotations and enable type checking for you.
Furthemore, you can configure
[tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
to type check our vanilla JavaScript with JSDoc annotations.
Then, you can have a separate "type check" step that does not emit any output, since you can run the vanilla JavaScript directly.

tsconfig.json to support vanilla JavaScript with JSDoc type annotations:

```js
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "ES2022",
    "moduleResolution": "node",

    // Enable checking Javascript and do not emit anything
    "allowJs": true,
    "checkJs": true,
    "noEmit": true
  }
}
```

### TypeScript vs JSDoc

JSDoc is a little bit more verbose but can also force us to document some of our parameters or functions more accuratly.
You can do pretty much everything you can do in TypeScript in JSDoc even advanced features like
[templates](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#template)
or
[satisfies](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#satisfies).

## How to Run TypeScript without a Build Step

I understand that some people really do not like the verbose JSDoc syntax.
Wouldn't it be great if we could simply run our TypeScript code directly?
Well we are lucky, because Node.js supports
[natively running TypeScript](https://nodejs.org/en/learn/typescript/run-natively)
since version 22.6.0.

### Stripping Type Information

The Node.js command line option
[--experimental-strip-types](https://nodejs.org/docs/latest-v22.x/api/cli.html#--experimental-strip-types)
strips all type information and TypeScript specific syntax from the file before running it.
It actually replaces all annotations with whitespace in order to avoid the need for source maps when you want to debug your code. Awesome!

```sh
node --experimental-strip-types example.ts
```

However, there are some caveats to be aware of:

- Node.js does not do any type checking. It just removes any type information to make the code run.
- There are some TypeScript features that are not available or implemented differently in JavaScript, e.g. enums and namespaces.

### Transforming Type Information

These TypeScript specific features require transpilation that is normally done by tsc.
However, since Node.js 22.7.0 a new flag was added to do just that,
[--experimental-transform-types](https://nodejs.org/docs/latest-v23.x/api/cli.html#--experimental-transform-types).
Since Node.js needs to transform the source code, the simple but beatiful white space replacement hack does not work here.
Enabling this option also enables source map generation and makes debugging a bit more tricky.

```sh
# Transform TypeScript features before execution
node --experimental-transform-types example.ts
```

### Summary

These are both great features.
If you can avoid TypeScript specific features like enums and namespaces, the --experimental-strip-types option is really great.
You can run your TypeScript without a build step and even start debugging it without any source map shenanigans.
Starting with Node.js 23.6.0 you do not even need to specify the flag anymore. It just works out of the box!

```bash
# With Node.js < 23.6.0
node --experimental-strip-types example.ts

# With Node.js >= 23.6.0
node example.ts
```
