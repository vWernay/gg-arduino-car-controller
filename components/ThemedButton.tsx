import { TouchableOpacity, type TouchableOpacityProps, StyleSheet, Text } from 'react-native';

export type ThemedButtonProps = TouchableOpacityProps & {
    title: string;
    color: string;
};

export function ThemedButton({
    color,
    onPress,
    disabled,
    title,
}: ThemedButtonProps) {
    return (
        <TouchableOpacity
            style={[disabled ? { ...styles.button, ...styles.buttonDisabled } : styles.button, { backgroundColor: color }]}
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
});
