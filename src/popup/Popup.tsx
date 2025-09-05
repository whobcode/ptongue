import * as browser from "webextension-polyfill";

import { useEffect, useState } from "react";
import Button from "../components/button";
import Card from "../components/card";
import ImageRotation from "../components/imageRotery";

import sky from "../assets/blue-sky.webp";
import openAI from "../assets/openai-logomark.svg";
import hf from "../assets/hf-logo.svg";
import anthopic from "../assets/Anthropic.svg";
import logo from "../assets/logo.png";

import { AppState, DropdownSetting, GroupSetting, initialState, Setting, ToggleSetting } from "../types";

/**
 * @interface RenderSettingProps
 * @property {Setting} setting - The setting object to render.
 * @property {string[]} path - The path to the setting in the state.
 */
interface RenderSettingProps {
  setting: Setting;
  path: string[];
}

/**
 * @interface RenderSettingItemProps
 * @property {string} settingKey - The key of the setting.
 * @property {Setting} setting - The setting object to render.
 * @property {string[]} path - The path to the setting in the state.
 */
interface RenderSettingItemProps {
  settingKey: string;
  setting: Setting;
  path: string[];
}

/**
 * The main component for the browser extension's popup.
 * It manages the extension's state and provides a UI for activation and settings.
 *
 * @returns {JSX.Element} The rendered popup component.
 */
function Popup() {
  const Images: string[] = [hf, openAI, anthopic];
  const [state, setState] = useState<AppState>(initialState);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(Images.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        }));
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to preload images:", error);
        setImagesLoaded(true); // Set to true even on error to allow rendering
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const fetchStoredState = async () => {
      try {
        const storedState = await browser.storage.sync.get(null);
        console.log(storedState);
    
        setState(prevState => {
          const newState = { ...prevState };
    
          // Update isActive
          if ('isActive' in storedState) {
            newState.isActive = storedState.isActive;
          }
    
          // Update settings
          Object.entries(newState.settings).forEach(([key, setting]) => {
            if (setting.type === 'toggle') {
              if (key in storedState) {
                (setting as ToggleSetting).value = storedState[key];
              }
            } else if (setting.type === 'group') {
              Object.entries((setting as GroupSetting).children).forEach(([childKey, childSetting]) => {
                const fullKey = `${key}.${childKey}`;
                if (childSetting.type === 'toggle' && fullKey in storedState) {
                  (childSetting as ToggleSetting).value = storedState[fullKey];
                } else if (childSetting.type === 'dropdown' && fullKey in storedState) {
                  (childSetting as DropdownSetting).value = storedState[fullKey];
                }
              });
            }
          });
    
          return newState;
        });
      } catch (error) {
        console.error("Error fetching state from storage:", error);
      }
    };
    
    fetchStoredState();
  }, []);
  
  /**
   * Toggles the active state of the extension.
   */
  const handleActive = () => {
    setState(prevState => {
      const newIsActive = !prevState.isActive;
      browser.storage.sync.set({ isActive: newIsActive })
        .then(() => console.log("Active state updated successfully"))
        .catch(err => console.error("Failed to update active state:", err));
      return { ...prevState, isActive: newIsActive };
    });
  };
  
  /**
   * Updates a setting in the state and stores it in the browser's sync storage.
   *
   * @param {string[]} path - The path to the setting in the state.
   * @param {boolean | string} newValue - The new value for the setting.
   */
  const updateSetting = (path: string[], newValue: boolean | string) => {
    setState(prevState => {
      const newState = { ...prevState };
      let current: any = newState.settings;
      const lastIndex = path.length - 1;
  
      for (let i = 0; i < lastIndex; i++) {
        if (current.type === 'group') {
          current = current.children;
        }
        current = current[path[i]];
      }
  
      const lastKey = path[lastIndex];
      if (current.type === 'group') {
        current = current.children;
      }
      current[lastKey] = { ...current[lastKey], value: newValue };
  
      // Update storage
      const storageKey = path.join('.');
      browser.storage.sync.set({ [storageKey]: newValue })
        .then(() => console.log(`Setting ${storageKey} updated successfully`))
        .catch(err => console.error(`Failed to update setting ${storageKey}:`, err));
      return newState;
    });
  };
  
  /**
   * @interface ToggleSwitchProps
   * @property {boolean} checked - Whether the switch is checked.
   * @property {(checked: boolean) => void} onChange - The function to call when the switch state changes.
   */
  interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
  
  /**
   * A toggle switch component.
   *
   * @param {ToggleSwitchProps} props - The component's props.
   * @returns {JSX.Element} The rendered toggle switch.
   */
  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300 transition"></div>
        <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
        <span
          className={`ml-3 text-sm ${
            checked ? "text-green-600" : "text-gray-400"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>
      </label>
    );
  };
  
  /**
   * Renders a setting based on its type.
   *
   * @param {RenderSettingProps} props - The component's props.
   * @returns {JSX.Element} The rendered setting component.
   */
  const RenderSetting: React.FC<RenderSettingProps> = ({ setting, path }) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <ToggleSwitch
            checked={setting.value}
            onChange={(checked) => updateSetting(path, checked)}
          />
        );
      case 'dropdown':
        return (
          <select
            value={setting.value}
            onChange={(e) => updateSetting(path, e.target.value)}
            className="ml-3 p-1 border rounded"
          >
            {setting.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'group':
        return (
          <div className=" ml-4">
            {Object.entries(setting.children).map(([key, childSetting]) => (
              <RenderSettingItem 
                key={key} 
                settingKey={key} 
                setting={childSetting} 
                path={[...path, key]} 
              />
            ))}
          </div>
        );
    }
  };
  
  /**
   * Renders a single setting item in the settings menu.
   *
   * @param {RenderSettingItemProps} props - The component's props.
   * @returns {JSX.Element} The rendered setting item.
   */
  const RenderSettingItem: React.FC<RenderSettingItemProps> = ({ settingKey, setting, path }) => (
    <li className="flex items-center justify-between pb-1 border-b-[0.5px]">
      <span className="text-black text-md">{setting.description}:</span>
      <RenderSetting setting={setting} path={path} />
    </li>
  );
  
  /**
   * Renders the settings menu.
   *
   * @returns {JSX.Element} The rendered settings menu.
   */
  const SettingsMenu: React.FC = () => {
    const { settings } = state;  // Assuming state is accessible here
  
    return (
      <div className="">
        <h2 className="text-lg font-bold">Quick Settings</h2>
        <ul className="space-y-4 text-sm">
          {Object.entries(settings).map(([key, setting]) => (
            <RenderSettingItem key={key} settingKey={key} setting={setting} path={[key]} />
          ))}
        </ul>
      </div>
    );
  };

  if (!imagesLoaded) {
    return (
      <div className="bg-white font-normal w-[400px] h-[400px] flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (state.isActive)
    return (
      <div className="bg-white font-normal w-[400px] h-[600px] overflow-y-hidden">
        <pre className="font-mono text-center"></pre>
        <div className="absolute z-10 cursor-default">
          <div className=" w-[400px] h-[600px] p-4 mx-auto bg-white rounded-xl shadow-md space-y-4 z-10">
            <div className=" flex p-2 border-b-[0.5px] border-b-black gap-x-1">
              <img src={logo} className="w-12" loading="eager"></img>
              <span className=" -ml-3 mt-[0.80rem] text-md font-bold">
                ParselTongue
              </span>
            </div>

            {/* Setting */}
            <SettingsMenu/>
            {/* Deactivation Button */}
            <div className=" w-full absolute left-0 bottom-5 z-20">
              <Button
                onClick={() => handleActive()}
                text={"Deactivate"}
                className={`mx-auto w-fit cursor-pointer rounded-3xl bg-zinc-900 hover:bg-zinc/95 text-white font-normal px-5 py-2 duration-1000 shadow-lg`}
              />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-white font-normal w-[400px] h-[400px] ">
      <pre className="font-mono text-center"></pre>
      <Card className={`w-[400px] shadow-md rounded-xl `}>
        <div
          className={`relative ${
            state.isActive ? "text-transparent duration-200" : "text-black"
          }`}
        >
          <img
            src={sky}
            alt="blue-sky"
            className="w-full opacity-85"
            loading="lazy"
          ></img>
          <div
            className={`absolute items-center justify-center inset-0 flex shadow-md z-10`}
          >
            {/* Text */}
            <div className=" flex flex-col mx-auto text-center pt-2 gap-y-1">
              <div className="text-4xl ">
                <h1>ParselTongue</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">Your prompt injecting</span>
                <ImageRotation className="w-7" images={Images} />
                <span className="text-lg">journey starts here</span>
              </div>

              {/* Activation Button */}
              <div className=" w-full absolute left-0 bottom-5 z-20">
                <Button
                  onClick={() => handleActive()}
                  text={state.isActive ? "Deactivate" : "Activate" }
                  className={` ${
                    state.isActive && "animate-hflip"
                  } mx-auto w-fit cursor-pointer rounded-3xl bg-white hover:bg-white/95 text-black font-normal px-5 py-2 duration-1000`}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Popup;



