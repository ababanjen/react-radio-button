import React, { useState, useEffect } from "react";
import { mockData } from "./mockData";
import "./App.css";
function App() {
  const [menus, setMenus] = useState(null);
  const [rules, setRules] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedToping, setSelectedTopping] = useState("");
  const [restrictedOptions, setRestrictedOptions] = useState(null);

  useEffect(() => {
    setMenus(mockData().menus);
    setRules(mockData().rules);
  }, []);

  useEffect(() => {
    if (selectedType) {
      ruleChecker(selectedType);
      setSelectedVariant("");
      setSelectedTopping("");
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedVariant) {
      ruleChecker(selectedType, selectedVariant);
      setSelectedTopping("");
    }
  }, [selectedVariant]);

  const ruleChecker = (tId, vId) => {
    const typeId = parseInt(tId);
    const VariantId = parseInt(vId);
    setRestrictedOptions([
      ...rules[typeId],
      ...[VariantId ? rules[VariantId] : []],
    ]);
  };

  function isMenuDisabled({ index, id }) {
    if (index <= 0) return false;
    if (index > 0 && !selectedType) return true;
    if (selectedVariant || selectedType) {
      return restrictedOptions?.find((opt) => opt === parseInt(id));
    }
  }

  function getOptionSetter(menuId) {
    return menuId === 0
      ? setSelectedType
      : menuId === 1
      ? setSelectedVariant
      : setSelectedTopping;
  }

  function getOptionValue(menuId) {
    return menuId === 0
      ? selectedType
      : menuId === 1
      ? selectedVariant
      : selectedToping;
  }

  function handleSelectOption({
    event: {
      target: { value },
    },
    index,
    disabled,
  }) {
    if (!disabled) {
      const setter = getOptionSetter(index);
      setter(value);
    }
  }

  return (
    <div className="App">
      <div className="title">
        <label>Menu Selection</label>
      </div>
      <div className="root">
        {menus?.map((menu, index) => {
          const menuType =
            index === 0
              ? "Select type"
              : index === 1
              ? "Select Variant"
              : "Select Toppings";
          return (
            <div
              key={`${menuType}-${index}`}
              className="container box-container"
            >
              <div className="menu-container">
                {
                  <div className="menu">
                    <div className="menu-label">
                      <label>{menuType}</label>
                    </div>
                    <div className="selection-container">
                      {menu.map((type) => {
                        const checked = type.id === getOptionValue(index);
                        const disabled = isMenuDisabled({ index, id: type.id });
                        return (
                          <div
                            className={`option-container ${
                              checked ? "selected-option" : ""
                            }`}
                            key={type.id}
                            onClick={() =>
                              handleSelectOption({
                                event: { target: { value: type.id } },
                                index,
                                disabled,
                              })
                            }
                          >
                            <input
                              type="radio"
                              name={type.value}
                              value={type.id}
                              checked={checked}
                              onChange={(event) =>
                                handleSelectOption({ event, index, disabled })
                              }
                              disabled={disabled}
                            />
                            <span className={disabled ? "disabled" : ""}>
                              {type.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
