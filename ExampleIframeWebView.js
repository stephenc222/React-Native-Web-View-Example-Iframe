import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// contrived testing via "srcdoc", but easily adjusted to "src" from a uri
const testIframe = `<iframe srcdoc='
<html>
  <script>
    function testClick () {
      parent.postMessage({test: 123})
    }
  </script>
  <body>
  <button onclick="testClick()">BUTTON</button>
  <div id="debug"></div>
  </body>
</html>
'
/>`

// renders an iframe, that posts message to the parent
export default class ExampleIframeWebView extends Component {
  handleMessage = event => {
    // successfully receiving a message, posted by an iframe, created and rendered by the webview
    console.log('handleMessage called', {
      eventData: JSON.parse(event.nativeEvent.data),
    });
  };
  render() {
    return (
      <WebView
        onMessage={this.handleMessage}
        javaScriptEnabled
        style={{width: width * 3, height: height * 6}}
        originWhitelist={['*']}
        // "wrapper" source input to allow message passing from their iframe, to our webview
        source={{
          html: `
          <html>
          <head>
              <script>
                window.addEventListener("message", event => window.ReactNativeWebView.postMessage(JSON.stringify(event.data)))
              </script>
          </head>
          ${testIframe}
          </html>
        `,
        }}
      />
    );
  }
}
