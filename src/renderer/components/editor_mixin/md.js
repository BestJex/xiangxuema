require('codemirror/lib/codemirror.css'); // codemirror
require('tui-editor/dist/tui-editor.css'); // editor ui
require('tui-editor/dist/tui-editor-contents.css'); // editor content
require('highlight.js/styles/github.css'); // code block highlight
var Editor = require('tui-editor');

export default {
    data() {
        return {

        }
    },
    methods: {
        htmlToMd() {
            let tempStr = this.articleContent.replace("<img", "^^^^");
            let mdStr = window.mdEditor.convertor.toMarkdown(tempStr);
            mdStr = mdStr.replace("^^^^", "<img");
            window.mdEditor.setValue(mdStr);
        },
        initEditorMD() {
            let self = this;
            new Editor({
                el: document.querySelector('#editorMD'),
                height: '100%',
                //language:'zh_CN', //todo:会显示台湾的语言
                hideModeSwitch: true,
                initialEditType: 'markdown',
                previewStyle: 'vertical',
                usageStatistics: false,
                events: {
                    load: function (editor) {
                        window.mdEditor = editor;
                        self.htmlToMd();
                    },
                    change: function () {
                        self.needSave = true;
                    }
                },
                hooks: {
                    addImageBlobHook: function (file, cb, source) {
                        //source of an event the item belongs to. 'paste', 'drop', 'ui'
                        self.imgSaveFileObj(file, (id, fullName, err) => {
                            let imgDom = '<img id="' + id + '" src="file://' + fullName + '" />';
                            window.mdEditor.insertText(imgDom);
                            self.needSave = true;
                        })
                    }
                }
            });
        }
    }
}