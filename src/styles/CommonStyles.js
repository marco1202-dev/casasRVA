import {
    StyleSheet,
    Dimensions
} from 'react-native'
import Colors from './Colors'
import { getResponsiveSize } from '../utils/AppUtils'

const se = Dimensions.get('window').width <= 320;
export const getScreenWidth = () => {
    return Dimensions.get('window').width;
};
const horizontal = se === true ? 12 : 16;

export default CommonStyles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: horizontal,
        alignItems: 'center',
        height: se === true ? 50 : 56
    },
    header_left: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: horizontal
    },
    header_right: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: horizontal
    },
    absolute_full: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flex_row_start: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    flex_row_end: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    flex_row_bw: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flex_row_reverse: {
        flexDirection: "row-reverse",
        alignItems: 'center'
    },
    btn_active: {
        alignItems: 'center',
        justifyContent: 'center',
        height: se === true ? 50 : 64,
        backgroundColor: Colors.active
    },
    btnDisabled: {
        backgroundColor: Colors.warmGrey3
    },
    btn_inactive: {
        alignItems: 'center',
        justifyContent: 'center',
        height: se === true ? 50 : 64,
        backgroundColor: Colors.inactive
    },
    btn_text: {
        fontFamily: 'rubik-medium',
        fontSize: se === true ? 14 : 18,
        color: Colors.white
    },
    main_font_medium: {
        fontFamily: 'rubik-medium',
        fontSize: getResponsiveSize(14),
        color: Colors.black
    },
    main_font_regular: {
        fontFamily: 'rubik-regular',
        fontSize: getResponsiveSize(14),
        color: Colors.black
    },
    main_font_bold: {
        fontFamily: 'rubik-bold',
        fontSize: getResponsiveSize(14),
        color: Colors.black
    },
    section_title: {
        fontFamily: 'rubik-Medium',
        fontSize: se === true ? 16 : 20,
        color: Colors.text_main,
        paddingRight: 16,
        lineHeight: se === true ? 24 : 32
    },
    content_text: {
        fontFamily: 'rubik-regular',
        fontSize: getResponsiveSize(14),
        color: '#909090',
        lineHeight: se === true ? 16 : 22
    },
    header_title: {
        fontFamily: 'rubik-bold',
        fontSize: getResponsiveSize(28),
        color: Colors.dark
    },
    statusContainer: {
        width: getResponsiveSize(80),
        position: 'absolute',
        left: getResponsiveSize(10),
        top: getResponsiveSize(10),
        zIndex: 1,
        paddingVertical: getResponsiveSize(3)
    }
})
