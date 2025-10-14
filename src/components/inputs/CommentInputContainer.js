import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
import {getNumberVal, getResponsiveSize} from '../../utils/AppUtils';

const CommentInputContainer = (props) => {

    return (
        <View style={[props.flex && styles.flex, {  paddingBottom: props.paddingBottom ?? getResponsiveSize(12), paddingHorizontal: props.paddingHorizontal ?? 0 }]}>
            <View style={[styles.commentContainer, CommonStyles.flex_row, {
                paddingVertical: Platform.OS === 'ios' ? getResponsiveSize(10) : getNumberVal(props.padding)
            }]}>
                <View style={{
                    zIndex: 1,
                    paddingHorizontal: 4,
                    backgroundColor: Colors.white,
                    position: 'absolute',
                    left: 10,
                    top: -9
                }}>
                    <Text style={[CommonStyles.main_font_medium, { color: '#878798', fontSize: getResponsiveSize(12) }]}>{props.title}{props.isPrimary && <Text style={{ color: Colors.RED7 }}>*</Text>}</Text>
                </View>
                {props.children}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    commentContainer: {
        borderColor: '#555479',
        borderWidth: 1,
        paddingHorizontal: getResponsiveSize(14),
        marginTop: getResponsiveSize(12),
        borderRadius: getResponsiveSize(6)
    },
    flex: {
        flex: 1
    }
});

export default CommentInputContainer;
