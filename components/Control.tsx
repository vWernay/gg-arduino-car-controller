import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, useColorScheme, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { useBluetooth } from "@/contexts/BluetoothContext";

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
                <ThemedButton title="Auto" color={selectedMode === 'auto' ? 'blue' : 'white'} disabled onPress={() => handleChangeMode('auto')} />
                <ThemedButton title="Seguir Linha" color={selectedMode === 'line' ? 'blue' : 'white'} disabled onPress={() => handleChangeMode('line')} />
            </View>
            {selectedMode === 'manual' && (
                <View style={styles.controlContainer}>
                    <View style={styles.row}>
                        <Ionicons name="caret-up-circle" size={96} color={isDarkMode ? 'white' : 'black'} onPress={() => sendCommand('forward')} />
                    </View>
                    <View style={[styles.row, { marginTop: 40, marginBottom: 40, justifyContent: 'space-between', width: '100%' }]}>
                        <Ionicons name="caret-back-circle" size={96} color={isDarkMode ? 'white' : 'black'} onPress={() => sendCommand('left')} />
                        <Ionicons name="caret-forward-circle" size={96} color={isDarkMode ? 'white' : 'black'} onPress={() => sendCommand('right')} />
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="caret-down-circle" size={96} color={isDarkMode ? 'white' : 'black'} onPress={() => sendCommand('backward')} />
                    </View>
                </View>
            )}
            <View style={styles.speedControlContainer}>
                <ThemedText style={styles.speedControlText}>Controle de Velocidade</ThemedText>
                <View style={styles.buttonGroup}>
                    <ThemedButton title="Baixa" color="white" onPress={() => sendCommand('speedLow')} />
                    <ThemedButton title="Média" color="white" onPress={() => sendCommand('speedMedium')} />
                    <ThemedButton title="Total" color="#fb2c92" onPress={() => sendCommand('speedHigh')} />
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
