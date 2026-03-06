import { useColorScheme } from '@/hooks/use-color-scheme';
import { LessonDataProvider } from '@/store/lesson-context';
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './root-navigator';

export function AppNavigator() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer
                theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
                <LessonDataProvider>
                    <RootNavigator />
                    <StatusBar style="auto" />
                </LessonDataProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
