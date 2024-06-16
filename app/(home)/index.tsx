import React, { useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Control } from "@/components/Control";
import { Scan } from "@/components/Scan";
import { useBluetooth } from "@/contexts/BluetoothContext";

export default function HomeScreen() {
    const { connecting, isConnected, selectedDevice, disconnectFromDevice } = useBluetooth();

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <View style={styles.buttonGroup}>
                    <ThemedButton
                        disabled={selectedDevice != null}
                        title="Conectar"
                        color="yellow"
                    />
                    <ThemedButton
                        disabled={selectedDevice === null}
                        onPress={disconnectFromDevice}
                        title="Desconectar"
                        color="white"
                    />
                </View>
                <View>
                    <ThemedText style={[styles.connectedText, { color: isConnected ? 'green' : 'red' }]}>
                        {isConnected ? 'Conectado!' : 'Não conectado!'}
                    </ThemedText>
                </View>
                {isConnected ? <Control /> : <Scan />}
                <View style={styles.footerContainer}>
                    <ThemedText>App feito por Victor Lellis (github.com/vWernay)</ThemedText>
                </View>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 8,
        overflow: 'hidden',
        flex: 1,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 8,
    },
    connectedText: {
        textAlign: 'center',
        fontSize: 16,
    },
    footerContainer: {
        position: 'absolute',
        textAlign: 'center',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
