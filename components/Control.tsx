import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, useColorScheme, Alert, GestureResponderEvent, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { useBluetooth } from "@/contexts/BluetoothContext";

const ArrowButton = ({ direction, onPress, isDarkMode }: { direction: 'up' | 'back' | 'forward' | 'down', onPress: ((event: GestureResponderEvent) => void) | undefined, isDarkMode: boolean }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Ionicons name={`caret-${direction}-circle`} size={96} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
);

export function Control() {
    const isDarkMode = useColorScheme() === 'dark';
    const { selectedDevice } = useBluetooth();
    const [selectedMode, setSelectedMode] = useState<'manual' | 'auto' | 'line'>('manual');

    const sendCommand = useCallback(async (command: string) => {
        if (!selectedDevice) return;
        try {
            await selectedDevice.write(command);
        } catch (error) {
            console.error('Falha ao enviar comando:', error);
            Alert.alert('Erro', 'Falha ao enviar comando');
        }
    }, [selectedDevice]);

    const handleChangeMode = (mode: 'manual' | 'auto' | 'line') => {
        try {
            sendCommand(mode);
            setSelectedMode(mode);
        } catch (error) {
            console.error('Falha ao enviar comando:', error);
            Alert.alert('Erro', 'Falha ao enviar comando');
        }
    }

    useEffect(() => {
        if (!selectedDevice) return;
        setSelectedMode('manual');
        sendCommand(selectedMode);
    }, [selectedDevice])

    return (
        <View>
            <View style={styles.buttonGroup}>
                <ThemedButton title="Manual" color={selectedMode === 'manual' ? 'blue' : 'white'} onPress={() => handleChangeMode('manual')} />
                <ThemedButton title="Auto" color={selectedMode === 'auto' ? 'blue' : 'white'} onPress={() => handleChangeMode('auto')} />
                <ThemedButton title="Seguir Linha" color={selectedMode === 'line' ? 'blue' : 'white'} onPress={() => handleChangeMode('line')} />
            </View>
            {selectedMode === 'manual' && (
                <View style={styles.controlContainer}>
                    <View style={styles.row}>
                        <ArrowButton direction="up" isDarkMode={isDarkMode} onPress={() => sendCommand('F')} />
                    </View>
                    <View style={[styles.row, { marginTop: 40, marginBottom: 40, justifyContent: 'space-between', width: '100%' }]}>
                        <ArrowButton direction="back" isDarkMode={isDarkMode} onPress={() => sendCommand('L')} />
                        <ArrowButton direction="forward" isDarkMode={isDarkMode} onPress={() => sendCommand('R')} />
                    </View>
                    <View style={styles.row}>
                        <ArrowButton direction="down" isDarkMode={isDarkMode} onPress={() => sendCommand('B')} />
                    </View>
                </View>
            )}
            <View style={styles.speedControlContainer}>
                <ThemedText style={styles.speedControlText}>Controle de Velocidade</ThemedText>
                <View style={styles.buttonGroup}>
                    <ThemedButton title="Baixa" color="white" onPress={() => sendCommand('1')} />
                    <ThemedButton title="Média" color="white" onPress={() => sendCommand('2')} />
                    <ThemedButton title="Total" color="#fb2c92" onPress={() => sendCommand('3')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 8,
    },
    controlContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedControlContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        gap: 16,
    },
    speedControlText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fb2c92',
    },
});
