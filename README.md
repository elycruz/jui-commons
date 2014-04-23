# Javascript Ui Commons - jui-commons

A Collection of commonly used/needed ui components built with
extensibility in mind using the jquery ui library (version 1.9.x +).

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

### Components
---------------------------
List of current components offered:
- jquery.juiAbstractPaginator
- jquery.juiBasicPaginator
- jquery.juiPaginatorWithTextField
- jquery.juiScrollableDropDown
- jquery.juiScrollPane
- jquery.juiSelectPicker

List of WIPs
- jquery.juiAffix
- jquery.juiFloatingScrollIndicators (candidate for rename)

#### jquery.jui.juiAbstractPaginator
----
The Jui Abstract Paginator offers a base for building paginators.
It includes hashes in it's options hash which are well thought out and
currently used in backend systems.

##### Methods:
- getPointer() - returns the current page pointer {null|String|Number}

#### jquery.jui.juiBase
----
- @todo insert docs for juibase here.

### Requirements
---------------------------
* Ecmascript 5 support (native or shim) (tentative).
* Phpjs shim (elycruz/phpjs).
* CheckJs (elycruz/checkjs).
* Modernizr
* Gsap (Green Sock Animation Platform)
* jquery 1.8 +
* jquery-ui 1.9 +
  * jquery-ui core
  * jquery-ui widget factory

### Todos
----------------------------
- [ ] @todo add licensing info here.
- [ ] @todo Consider putting all plugins in src/ui to simplify things.
- [ ] @todo list the currently available plugins in the library here.