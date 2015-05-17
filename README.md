# jui-commons (originally Javascript Ui Commons)

A Collection of commonly used/needed ui components built using the jquery 
widget library (version 1.9.x +) and extensibility in mind.

### Included files:
-----------

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

### Components
---------------------------
List of current components offered:
- jquery.juiAbstractPaginator
- jquery.juiBasicPaginator
- jquery.juiMouse
- jquery.juiPaginatorWithTextField
- jquery.juiScalableBtn
- jquery.juiScrollableDropDown
- jquery.juiScrollPane
- jquery.juiSelectPicker

List of WIPs
- jquery.juiAffix
- jquery.juiFloatingScrollIndicators (candidate for rename)
- jquery.juiDialog

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
* Sjljs (elycruz/sjljs).
* Modernizr
* Gsap (Green Sock Animation Platform)
* jquery 1.8 +
* jquery-ui 1.9 +
  * jquery-ui core
  * jquery-ui widget factory

