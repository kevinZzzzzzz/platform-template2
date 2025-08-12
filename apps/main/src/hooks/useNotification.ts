import React, { useState, useEffect } from 'react';

function useNotification(props: any) {
    
  const playMusic = (musicUrl: string) => {
    const music = new Audio(musicUrl);
    music.play();
  }
  const speakSound = (textToSpeak: string) => {
    window.speechSynthesis.cancel();
    const newUtterance = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices()
    newUtterance.text = textToSpeak.replace(/\[|\]/g, '');
    const CN = voices.filter(item => item.lang === 'zh-CN')
    const localCN = CN.filter(item => item.localService)
    newUtterance.voice = localCN.length?localCN[0]:CN[0]
    window.speechSynthesis.speak(newUtterance);
  }
  return {
    
  }
}
export default useNotification