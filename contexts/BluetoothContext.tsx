import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice, BluetoothDeviceEvent, BluetoothEventSubscription } from 'react-native-bluetooth-classic';
import { StateChangeEvent } from 'react-native-bluetooth-classic/lib/BluetoothEvent';

interface BluetoothContextProps {
    isBluetoothEnabled: boolean;
    pairedDevices: BluetoothDevice[];
    selectedDevice: BluetoothDevice | null;
    isConnected: boolean;
    connecting: boolean;
    connectToDevice: (device: BluetoothDevice) => Promise<void>;
    disconnectFromDevice: () => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextProps | undefined>(undefined);

export const useBluetooth = (): BluetoothContextProps => {
    const context = useContext(BluetoothContext);
    if (!context) {
        throw new Error('useBluetooth must be used within a BluetoothProvider');
    }
    return context;
};

interface BluetoothProviderProps {
    children: ReactNode;
}

export const BluetoothProvider: React.FC<BluetoothProviderProps> = ({ children }) => {
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
    const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    let deviceDisconnectedSubscription: BluetoothEventSubscription;

    async function checkIsBluetoothEnabled() {
        try {
            const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
            setIsBluetoothEnabled(enabled);
        } catch (err) {
            Alert.alert('Erro', 'O Bluetooth deve estar disponível no dispositivo!', [{ text: 'OK', onPress: () => checkIsBluetoothEnabled() }]);
        }
    }

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                const allGranted = Object.values(granted).every(
                    (status) => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allGranted) {
                    Alert.alert('Permissões necessárias', 'Conceda permissões de Bluetooth e localização para que o aplicativo funcione corretamente.', [{ text: 'OK', onPress: () => requestBluetoothPermissions() }]);
                    return false;
                }
                return true;
            } catch (error) {
                console.error('Error requesting Bluetooth permissions:', error);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const subscription = RNBluetoothClassic.onStateChanged(onStateChanged);
        const initBluetooth = async () => {
            const permissionsGranted = await requestBluetoothPermissions();
            if (permissionsGranted) {
                checkIsBluetoothEnabled();
            }
        };
        initBluetooth();

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        async function fetchPairedDevices() {
            try {
                const devices = await RNBluetoothClassic.getBondedDevices();
                setPairedDevices(devices);
            } catch (error) {
                console.error('Failed to fetch paired devices:', error);
                Alert.alert('Erro', 'Falha ao buscar dispositivos pareados, verifique se o Bluetooth está ativado ');
            }
        }

        if (isBluetoothEnabled) {
            fetchPairedDevices();
        }
    }, [isBluetoothEnabled]);

    const connectToDevice = useCallback(async (device: BluetoothDevice) => {
        if (connecting || (selectedDevice && selectedDevice.address === device.address)) return;

        setConnecting(true);
        try {
            const connected = await device.connect();
            if (!connected) {
                throw new Error('Failed to connect to device');
            }
            setSelectedDevice(device);
            setIsConnected(true);
            deviceDisconnectedSubscription = RNBluetoothClassic.onDeviceDisconnected(onDeviceDisconnected)
            Alert.alert('Connected', `Conectado a ${device.name}`);
        } catch (error) {
            console.error('Failed to connect to device:', error);
            Alert.alert('Connection Failed', `Falha ao conectar a ${device.name}`);
        } finally {
            setConnecting(false);
        }
    }, [connecting, selectedDevice]);

    const disconnectFromDevice = useCallback(async () => {
        if (!selectedDevice) return;

        try {
            await selectedDevice.disconnect();
            setSelectedDevice(null);
            setIsConnected(false);
            Alert.alert('Desconectado', 'Desconectado do dispositivo');
        } catch (error) {
            console.error('Failed to disconnect from device:', error);
            setSelectedDevice(null);
            setIsConnected(false);
        }
    }, [selectedDevice]);

    const onStateChanged = (e: StateChangeEvent) => {
        setIsBluetoothEnabled(e.enabled);
        if (!e.enabled) {
            setPairedDevices([]);
            setSelectedDevice(null);
            setIsConnected(false);
        }
    }

    const onDeviceDisconnected = (e: BluetoothDeviceEvent) => {
        if (selectedDevice && selectedDevice.address === e.device.address) {
            setSelectedDevice(null);
            setIsConnected(false);
            deviceDisconnectedSubscription.remove();
            Alert.alert('Desconectado', 'Desconectado automaticamente do dispositivo');
        }
    };

    return (
        <BluetoothContext.Provider value={{
            isBluetoothEnabled,
            pairedDevices,
            selectedDevice,
            isConnected,
            connecting,
            connectToDevice,
            disconnectFromDevice,
        }}>
            {children}
        </BluetoothContext.Provider>
    );
};
