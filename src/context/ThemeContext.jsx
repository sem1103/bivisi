import { createContext, useState } from "react";


export  const ThemeContext = createContext();


export default function ThemeProvider ({children}) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: light)');
    const [themeMode, setThemeMode] = useState()

    const setTheme = (theme, switcher) => {
        if(theme){
            document.documentElement.classList.remove('dark__theme')
            document.documentElement.classList.add('light__theme')
            document.documentElement.style.setProperty('--backgroundColor', '#fff');
            document.documentElement.style.setProperty('--textColor', '#000');
            document.documentElement.style.setProperty('--primaryColor', ' #ededed ');
        }else{
            document.documentElement.classList.remove('light__theme')
            document.documentElement.classList.add('dark__theme')
            document.documentElement.style.setProperty('--backgroundColor', '#0F0F0F');
            document.documentElement.style.setProperty('--textColor', '#fff');
            document.documentElement.style.setProperty('--primaryColor', '#292929');
        }
        setThemeMode(theme)
        localStorage.setItem('themeMode', JSON.stringify(theme))
    };
    
      
    

    return(
        <ThemeContext.Provider
            value={
                {
                    setTheme,
                    prefersDarkScheme,
                    themeMode
                }
            }
        >
            {children}
        </ThemeContext.Provider>
    )
}