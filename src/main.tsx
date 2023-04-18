import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import App from "@containers/app";
import {createTheme, ThemeProvider} from "@mui/material";
import {SnackbarProvider} from 'notistack';
import {LicenseInfo} from "@mui/x-license-pro";


LicenseInfo.setLicenseKey(
    "e9268055e7858ccf7d7bc5d078217f7eTz00ODIyOCxFPTE2OTA3Mzk5NDkxNjgsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
);


const theme = createTheme({
    palette: {
        primary: {
            // light: 这将从 palette.primary.main 中进行计算，
            main: '#F59F9F',
            // dark: 这将从 palette.primary.main 中进行计算，
            // contrastText: 这将计算与 palette.primary.main 的对比度
        },
        secondary: {
            main: '#000'
        }
    },
});

const AppInstance = (
    <StrictMode>
        <SnackbarProvider
            anchorOrigin={
                {
                    vertical: 'top',
                    horizontal: 'center',
                }
            }
            autoHideDuration={3000}
            style={{minWidth: 'max-content'}}
            disableWindowBlurListener
        >
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </SnackbarProvider>
    </StrictMode>
)

createRoot(document.getElementById('root')!).render(AppInstance)
