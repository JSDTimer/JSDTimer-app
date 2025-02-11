import { StyleSheet } from 'react-native';

export let styles = {
    main: {
        backgroundColor: "#000000",
        height: "100%",
        width: "100%",
        color: "#f8f9fa"
    },
    text: {
        color: "#FFFFFF",
    },
    h1: {
        fontSize: 60
    },
    header: {
        textAlign: 'center',
        paddingTop: 150,
    },
};

const defaultstyles = StyleSheet.create(styles)


export default defaultstyles;