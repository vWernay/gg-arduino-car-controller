import { Stack } from 'expo-router';
import { useColorScheme, StyleSheet, Image, Text, View } from 'react-native';

function CustomHeaderTitle({ title }: { title: string }) {
    return (
        <View style={styles.headerContainer}>
            <Image style={styles.headerImage} source={require('@/assets/images/logo_gg.png')} />
            <Text style={styles.headerTitleText}>{title}</Text>
        </View>
    );
}

export default function HomeLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#0046A4' : '#1778FB',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: props => <CustomHeaderTitle {...props} title="Controlador Arduino Robô" />,
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerImage: {
        width: 64,
        height: 64,
    },
    headerTitleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
