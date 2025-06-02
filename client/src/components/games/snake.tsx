import { useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { IRootState } from "../../redux"

declare global {
    interface Window {
        unityInstance?: any; // ou um tipo mais específico se você souber
    }
}

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    }); // Atualiza após cada render para ter o valor da render anterior na próxima
    return ref.current;
}

export default function Snake() {

    // Redux
    const arcadeVolume = useSelector((state: IRootState) => state.arcade[2].volume)
    const arcadeBinds = useSelector((state: IRootState) => state.controls[2])
    const joystickControls = useSelector((state: IRootState) => state.controls[0])
    const buttonsControls = useSelector((state: IRootState) => state.controls[1])
    const bindsEventProperties = useSelector((state: IRootState) => state.controls[3]);

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

    const unityWindow = useMemo(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            return iframeRef.current.contentWindow;
        }
        return window;
    }, [iframeLoaded])

    useEffect(() => {
        if (!iframeLoaded) return;
        const handleUnityReady = () => {
            if (iframeRef.current) {
                const unityInstance = iframeRef.current.contentWindow!.unityInstance;
                if (unityInstance) {
                    unityInstance.SendMessage('InputManager', 'SetExternalBinds', JSON.stringify({
                        "upJoystick": arcadeBinds.up[0],
                        "downJoystick": arcadeBinds.down[0],
                        "leftJoystick": arcadeBinds.left[0],
                        "rightJoystick": arcadeBinds.right[0],
                        "returnButton": arcadeBinds.btnRight[0],
                        "selectButton": arcadeBinds.btnLeft[0],
                    }));
                    console.log('Binds setadas');
                } else {
                    console.warn('Instância Unity não encontrada');
                }
            }
        }

        iframeRef.current!.contentWindow!.addEventListener('unity-loaded', handleUnityReady);

        return () => {
            iframeRef.current!.contentWindow!.removeEventListener('unity-loaded', handleUnityReady);
        }
    }, [iframeLoaded])

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