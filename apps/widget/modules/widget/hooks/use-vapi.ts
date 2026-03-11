import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';

interface TranscriptMessage {
    role: 'user' | 'assistant';
    text: string;
};

export const useVapi = (initialTranscript: TranscriptMessage[] = []) => {
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>(initialTranscript);

    useEffect(() => {
        // only for testing Vapi API, otherwise customer will provide their oiwn API keys
        const vapiInstance = new Vapi("4a922570-6c80-4582-b198-d17f5f700f65");
        setVapi(vapiInstance);

        vapiInstance.on('call-start', () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        });
        vapiInstance.on('call-end', () => {
            setIsConnected(false);
            setIsConnecting(false);
            setTranscript([]);
        });

        vapiInstance.on('speech-start', () => {
            setIsSpeaking(true);
        });
        vapiInstance.on('speech-end', () => {
            setIsSpeaking(false);
        });

        vapiInstance.on('error', (error) => {
            console.error(error, "VAPI_ERROR");
            setIsConnecting(false);
        });
        vapiInstance.on('message', (message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                setTranscript(prev => [...prev, {
                    role: message.sender === 'user' ? 'user' : 'assistant',
                    text: message.transcript,
                }]);
            }
        });

        return () => { vapiInstance?.stop();}

    }, []);

    const startCall = () => {
         setIsConnecting(true);
        if(vapi) {
            vapi.start("ac83b2bc-9794-4a32-a943-dfe0a874f1a7");
        }
    }

    const endCall = () => {
        if(vapi) {
            vapi.stop();
        }
    }

    return {
        isConnected,
        isConnecting,
        isSpeaking,
        transcript,
        startCall,
        endCall,
    };
}