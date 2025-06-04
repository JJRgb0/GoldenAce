import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IRootState } from "../../redux"
import { setPath } from "../../redux/slices/arcadeSlice";
import usePrevious from "../../hooks/use-previous";

declare global {
    interface Window {
        unityInstance?: any; // ou um tipo mais específico se você souber
    }
}

export default function Snake() {

    // Redux
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)
    const arcadeBinds = useSelector((state: IRootState) => state.controls[2])
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const bindsEventProperties = useSelector((state: IRootState) => state.controls[3]);
    const dispatch = useDispatch();


    // States
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Refs
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    // Previous states
    const prevJoystickUp = usePrevious(joystickControls.up);
    const prevJoystickDown = usePrevious(joystickControls.down);
    const prevJoystickLeft = usePrevious(joystickControls.left);
    const prevJoystickRight = usePrevious(joystickControls.right);
    const prevButtonsRight = usePrevious(buttonsControls.btnRight);
    const prevButtonsLeft = usePrevious(buttonsControls.btnLeft);

    const isInDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true';
    const url = import.meta.env.VITE_URL;

    const unityWindow = useMemo(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            return iframeRef.current.contentWindow;
        }
        return window;
    }, [iframeLoaded])

    // Add quit game event listener in window
    useEffect(() => {
        if (!iframeLoaded) return;
        const handleMessageFromUnity = (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (eventData.type === 'unityGameWantsToClose') {
                dispatch(setPath('/games'))
            }
            if (iframeRef.current) {
                iframeRef.current.src = 'about:blank';
            }
        }

        window.addEventListener('message', handleMessageFromUnity);
        return () => {
            window.removeEventListener('message', handleMessageFromUnity);
        }
    }, [iframeLoaded])

    // Send arcade binds to Unity when the iframe is loaded
    useEffect(() => {
        if (!iframeLoaded) return;
        const handleUnityReady = () => {
            if (iframeRef.current) {
                const unityInstance = unityWindow.unityInstance;
                if (unityInstance) {
                    unityInstance.SendMessage('InputManager', 'SetExternalBinds', JSON.stringify({
                        "upJoystick": arcadeBinds.up[0],
                        "downJoystick": arcadeBinds.down[0],
                        "leftJoystick": arcadeBinds.left[0],
                        "rightJoystick": arcadeBinds.right[0],
                        "returnButton": arcadeBinds.btnRight[0],
                        "selectButton": arcadeBinds.btnLeft[0],
                    }));
                    unityInstance.SendMessage('GameManager', 'SetTargetOrigin', isInDevelopment ? 'http://localhost:5173' : url);
                    unityInstance.SendMessage('GameManager', 'SetAudioVolume', arcadeVolume);
                    console.log('Binds setadas');
                } else {
                    console.warn('Instância Unity não encontrada');
                }
            }
        }

        unityWindow.addEventListener('unity-loaded', handleUnityReady);

        return () => {
            unityWindow.removeEventListener('unity-loaded', handleUnityReady);
        }
    }, [iframeLoaded])

    // Control joystick and button events to Unity
    useEffect(() => {
        if (!iframeLoaded) return;

        const dispatchKeyEventToUnity = (bindDetails: any, eventType: 'keydown' | 'keyup') => {
            if (bindDetails && unityWindow) {
                // Idealmente, bindDetails é o objeto {key, code, keyCode, which}
                // Se bindsEventProperties.eUp for esse objeto:
                unityWindow.dispatchEvent(new KeyboardEvent(eventType, {
                    key: bindDetails.key,
                    code: bindDetails.code,
                    keyCode: bindDetails.keyCode, // Adicione se disponível
                    which: bindDetails.which,     // Adicione se disponível
                    bubbles: true
                }));
            }
        };

        if (joystickControls.up && !prevJoystickUp) dispatchKeyEventToUnity(bindsEventProperties.eUp, 'keydown');
        if (!joystickControls.up && prevJoystickUp) dispatchKeyEventToUnity(bindsEventProperties.eUp, 'keyup');

        if (joystickControls.down && !prevJoystickDown) dispatchKeyEventToUnity(bindsEventProperties.eDown, 'keydown');
        if (!joystickControls.down && prevJoystickDown) dispatchKeyEventToUnity(bindsEventProperties.eDown, 'keyup');

        if (joystickControls.left && !prevJoystickLeft) dispatchKeyEventToUnity(bindsEventProperties.eLeft, 'keydown');
        if (!joystickControls.left && prevJoystickLeft) dispatchKeyEventToUnity(bindsEventProperties.eLeft, 'keyup');

        if (joystickControls.right && !prevJoystickRight) dispatchKeyEventToUnity(bindsEventProperties.eRight, 'keydown');
        if (!joystickControls.right && prevJoystickRight) dispatchKeyEventToUnity(bindsEventProperties.eRight, 'keyup');

        if (buttonsControls.btnRight && !prevButtonsRight) dispatchKeyEventToUnity(bindsEventProperties.eBtnRight, 'keydown');
        if (!buttonsControls.btnRight && prevButtonsRight) dispatchKeyEventToUnity(bindsEventProperties.eBtnRight, 'keyup');

        if (buttonsControls.btnLeft && !prevButtonsLeft) dispatchKeyEventToUnity(bindsEventProperties.eBtnLeft, 'keydown');
        if (!buttonsControls.btnLeft && prevButtonsLeft) dispatchKeyEventToUnity(bindsEventProperties.eBtnLeft, 'keyup');
    }, [iframeLoaded, joystickControls.up, prevJoystickUp, joystickControls.down, prevJoystickDown, joystickControls.left, prevJoystickLeft, joystickControls.right, prevJoystickRight, buttonsControls.btnRight, prevButtonsRight, buttonsControls.btnLeft, prevButtonsLeft]);

    return (
        <iframe
            src="/games/snake/index.html"
            ref={iframeRef}
            width="878"
            height="777"
            className="overflow-hidden border-none"
            title="Snake Game"
            onLoad={() => setIframeLoaded(true)}
            allowFullScreen
        />
    )
}