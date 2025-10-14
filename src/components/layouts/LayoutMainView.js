import React from 'react';
import { Platform, View, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/Colors';
const LayoutMainView = ({ children, isAvoid, style }) => {

    if (isAvoid) {
        return (
            <TouchableHighlight style={[styles.container]} activeOpacity={1} underlayColor={'#00000000'} onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right']}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        {children}
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableHighlight>

        )
    }

    return (
        <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right']}>
            {children}
        </SafeAreaView>
    )

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1
    }
});

export default LayoutMainView;