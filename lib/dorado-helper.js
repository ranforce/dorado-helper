'use babel';

import DoradoHelperView from './dorado-helper-view';
import {
  CompositeDisposable
} from 'atom';

export default {

  doradoHelperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.doradoHelperView = new DoradoHelperView(state.doradoHelperViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.doradoHelperView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dorado-helper:convert-ClientEvent': () => this.convert('ClientEvent')
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.doradoHelperView.destroy();
  },

  serialize() {
    return {
      doradoHelperViewState: this.doradoHelperView.serialize()
    };
  },

  convert(type) {
    console.log(`DoradoHelper convert-type: ${type}`);
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      const gname = editor.getGrammar().name;
      if (/dorado.*view.*xml/i.test(gname)) {
        const fullText = editor.getText();
        const parttern = /<ClientEvent([^>]*)>([^<]*)<\/ClientEvent>/g;
        const resText = fullText.replace(parttern, function(match, names, inner) {
          const res = inner.replace(/&((#\w+)|([^#]\w+));/g, function(m2, mall, mcode, mname) {
            const dic = {
              "&lt;": "<",
              "&gt;": ">",
              "&amp;": "&",
              "&apos;": "'",
              "&quot;": "\""
            };
            if (mcode) {
              if (m2 == "&#xD;") {
                return ""
              } else {
                return String.fromCharCode(parseInt("0" + mcode.substr(1)));
              }
            } else {
              return dic[m2];
            }
          });
          return `<ClientEvent${names}><![CDATA[\n${res.trim()}\n]]><\/ClientEvent>`
        });
        editor.setText(resText);
      }
    }
  },

  toggle() {
    console.log('DoradoHelper was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
