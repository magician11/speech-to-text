export default class SpeechToText {
  /*
  This module is largely inspired by this article:
  https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API

  Arguments for the constructor:

    - onFinalised - a callback that will be passed the finalised transcription from the cloud. Slow, but accurate.
    - onEndEvent - a callback that will be called when the end event is fired (speech recognition engine disconnects).
    - onAnythingSaid - a callback that will be passed interim transcriptions. Fairly immediate, but less accurate than finalised text.
    - language - the language to interpret against. Default is US English.

    */
  constructor(onFinalised, onEndEvent, onAnythingSaid, language = 'en-US') {
    // Check to see if this browser supports speech recognition
    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error(
        "This browser doesn't support speech recognition. Try Google Chrome."
      );
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // set interim results to be returned if a callback for it has been passed in
    this.recognition.interimResults = !!onAnythingSaid;
    this.recognition.lang = language;

    let finalTranscript = '';

    // process both interim and finalised results
    this.recognition.onresult = event => {
      let interimTranscript = '';

      // concatenate all the transcribed pieces together (SpeechRecognitionResult)
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcriptionPiece = event.results[i][0].transcript;
        // check for a finalised transciption in the cloud
        if (event.results[i].isFinal) {
          finalTranscript += transcriptionPiece;
          onFinalised(finalTranscript);
          finalTranscript = '';
        } else if (this.recognition.interimResults) {
          interimTranscript += transcriptionPiece;
          onAnythingSaid(interimTranscript);
        }
      }
    };

    this.recognition.onend = () => {
      onEndEvent();
    };
  }

  startListening() {
    this.recognition.start();
  }

  stopListening() {
    this.recognition.stop();
  }
}
