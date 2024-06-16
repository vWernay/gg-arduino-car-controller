import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Pressable,
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    useColorScheme
} from 'react-native';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useBluetooth } from '@/contexts/BluetoothContext';

export function Scan() {
    const { connecting, connectToDevice, pairedDevices } = useBluetooth();
    const isDarkMode = useColorScheme() === 'dark';

    const handleConnect = (device: BluetoothDevice) => {
        if (!connecting) {
            connectToDevice(device);
        }
    };

    const renderItem = ({ item }: { item: BluetoothDevice }) => (
        <Pressable onPress={() => handleConnect(item)} style={styles.deviceCard} disabled={connecting}>
            <ThemedText type='defaultSemiBold' style={styles.deviceName}>{item.name}</ThemedText>
            <ThemedText type='link' style={styles.deviceAddress}>{item.address}</ThemedText>
        </Pressable>
    );

    const ItemSeparatorComponent = () => (
        <View style={[styles.separator, { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }]} />
    );

    return (
        <SafeAreaView style={styles.mainPage}>
            <View>
                <FlatList
                    data={pairedDevices}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.address}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    ListHeaderComponent={<ThemedText type='title' style={styles.headerText}>Dispositivos pareados:</ThemedText>}
                    ListEmptyComponent={<ThemedText type='subtitle'>Nenhum dispositivo emparelhado encontrado.</ThemedText>}
                />
            </View>
            {connecting && (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size={Platform.OS === 'android' ? 70 : 'large'} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainPage: {
        flex: 1,
        padding: 16,
    },
    headerText: {
        color: 'yellow',
    },
    separator: {
        width: '100%',
        height: 2,
    },
    deviceCard: {
        paddingVertical: 8,
    },
    deviceName: {
        fontSize: 24,
    },
    deviceAddress: {
        marginTop: 8,
        fontSize: 18,
    },
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
