import React from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/Colors';
const LayoutChatView = ({ children, isAvoid, style }) => {
    return (
        <SafeAreaView style={[styles.container, style]} >
            {
                isAvoid ?
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={[styles.container]}>
                        {children}
                    </KeyboardAvoidingView> :
                    children
            }

        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1
    }
});

export default LayoutChatView;