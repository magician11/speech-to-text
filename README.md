# Speech To Text

A speech recognition module to convert speech into text.

## Install

`npm install speech-to-text`

## Typical Usage

Here is the module being used in a React component

```javascript
import React, { useState, useEffect } from 'react';
import SpeechToText from 'speech-to-text';

function MyComponent() {
  const [interimText, setInterimText] = useState('');
  const [finalisedText, setFinalisedText] = useState([]);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [listener, setListener] = useState(null);

  useEffect(() => {
    const onAnythingSaid = text => {
      setInterimText(text);
    };

    const onEndEvent = () => {
      if (listening) {
        listener?.startListening();
      }
    };

    const onFinalised = text => {
      setFinalisedText(prev => [text, ...prev]);
      setInterimText('');
    };

    try {
      const speechListener = new SpeechToText(onFinalised, onEndEvent, onAnythingSaid);
      setListener(speechListener);
    } catch (error) {
      setError(error.message);
    }

    // Cleanup function
    return () => {
      listener?.stopListening();
    };
  }, [listening, listener]);

  // Component JSX would go here...
}
```

## API

### The constructor

- onFinalised - a callback that will be passed the finalised transcription from the cloud. Slow, but accuate.
- onEndEvent - a callback that will be called when the end event is fired (speech recognition engine disconnects).
- onAnythingSaid - (optional) a callback that will be passed interim transcriptions. Fairly immediate, but less accurate than finalised text.
- language - (optional) the language to interpret against. Default is US English, and the supported languages are listed [here](https://cloud.google.com/speech-to-text/docs/languages).

The constructor will throw an error if speech recognition is not supported by the browser. [Browser support](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility) includes Chrome, Edge, and Safari.

```javascript
if (!('webkitSpeechRecognition' in window)) {
  throw new Error("This browser doesn't support speech recognition. Try Google Chrome.");
}
```

### startListening

Initiates listening to speech input.

### stopListening

Does just that. Stops listening.

## License

MIT
