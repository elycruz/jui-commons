# jQuery Ui Commons - jui-commons
----------
Collection of commonly used/needed ui components built with
extensibility in mind using the jquery ui library version 1.9 +.

### The Base: jui.juiBase
-----------
The juiBase component offers a few convenience methods that make developing
jquery-ui plugins even more of a breeze!

- It borrows the ui hash idea from backbone and extends the idea by
allowing hash configs instead of selector strings for the ui elements.

- It allows you to fetch values from the options hash whether they are
functions or plain values (returns the return values of functions in
the hash by default).

### File Naming Conventions
-----------
All jui plugins share the following naming conventions:

`jquery.juiPluginNameHere.js`

### Jui Components are broken down into major categories:
-----------
- effects     - Components that create specific ui effects (tentative).

- ui          - Ui specific components (usually composed together with
                other ui components to build larger,
                more encompassing components)

- utils       - Utilities that may be commonly used throughout the
                different components of the jui-eco-sphere.

@todo list methods here

@todo Consider putting all plugins in src/ui to simplify things.

@todo list the currently available plugins in the library here.

### Requirements
---------------------------
* Ecmascript 5 support (native or shim).
* Phpjs shim (elycruz/phpjs).
* Modernizr
* Gsap (Green Sock Animation Platform)
* jquery 1.8 +
* jquery-ui 1.8 +
  * jquery-ui core
  * jquery-ui widget factory

@todo add licensing info here.
