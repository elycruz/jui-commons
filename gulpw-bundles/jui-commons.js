module.exports = function () {
    return {
        "alias": "juicommons",
        "version": "0.2.6-rc",
        "description": "",
        "files": {
            "js": [
                'src/js/jquery.juiBase.js',
                'src/js/jquery.juiMouse.js',
                'src/js/jquery.juiAbstractPaginator.js',
                'src/js/jquery.juiBasicPaginator.js',
                'src/js/jquery.juiPaginatorWithTextField.js',
                'src/js/jquery.juiScrollPane.js',
                'src/js/jquery.juiDialog.js',
                'src/js/jquery.juiScalableBtn.js',
                'src/js/jquery.juiScrollableDropDown.js',
                'src/js/jquery.juiSelectPicker.js'
            ],
            "html": [
                './index.html'
            ]
        },
        "compass": {
            "configrb": './config.rb'
        }
        //"copy": {
        //    "files": {
        //        "./file/path/to/copy.ext": "./file/path/to/copy/to.ext"
        //    }
        //},
        //"watch": {
        //    "otherFiles": []
        //}
    }
};