# SDK Limitations from a front-end use case

1. Firstly, The covalent SDK source code isn't available thereby making it harder to debug errors when encountered in front-end development which would make it harder to suggest solutions for users and enhance ux.

2. Integrating the covalent  SDK with front-end technologies is more difficult because you would have to install the npm package to access classes and methods and the developer would have to account for compatibility with other packages unlike.

3. The covalent SDK(gold rush) offers less customization in the colors, paddings and card classes. The sdk forces front end developers in limited box of options which might not fit the style of their application.

4. Using the SDK does not allow for developers to paginate, sort, filter data received at requests. Front-end developers would have to perform those tasks at the client side which would lead to a larger code base.

5.  The sdk depends on extra dependencies to be installed which would increase the code base bundle size and thereby may affect performance.

6. The covalent SDK is only limited to Python and Typescript thereby not accommodating developers that make use of other languages such as Rust, Java, c##, c.

7. Using the covalent sdk does not have request customization such as headers, content type, method specification and others.

8. when using custom components from Gold rush kit, developers can't implement functions that are triggered by user interactions on the web applications which could be huge hindrance especially when there needs to be modals or re-routing.

# LIMITATIONS OF USING THE COVALENT SDK vs API
1. Limited event Response: While using the sdk, front end developers can't set  up event listeners to react to user interactions on components such as drags, clicks etc. like in Covalents Gold rush kit There thereby, it would better to make use of the API. that way, front-end developers can fetch the data and render them on their custom components with their desired event listeners.

2. Speed: While testing, i discovered that API requests are faster compared to the SDK. And speed is very essential when developing web applications.

3. Dependency management: Keeping up with sdk updates on the long run might be challenging especially with breaking changes which might interrupt the services offered by the web applications. Asides that, a developer would have to account for dependencies and browser compactibility.

4. The covalent SDK is limited to only python and Typescript developers, while the API is accessible to all developers.

5. SDKs are environment and hardware dependent, which means they may not work in specific languages or browsers which limits the access of certain web apps. unlike a reast full api which could be accessed by almost anyone and has a wider reach into environments and browsers.

6. SDKs don't offer server side filtering, sorting or paginations unlike APIs.

7. Making use of APIs is more light weight and efficient because one doesn't have to install extra dependencies which would increase the build size of the application like using the SDK.