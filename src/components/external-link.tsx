import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import React from 'react';
import { Linking, Platform, Text, type TextProps } from 'react-native';

type Props = TextProps & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await openBrowserAsync(href, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
    } else {
      Linking.openURL(href);
    }
  };

  return <Text {...rest} onPress={handlePress} accessibilityRole="link" />;
}
