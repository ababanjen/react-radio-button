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
    setRestrictedOptions(rules[typeId].concat(vId ? rules[VariantId] : []));
  };

  function isMenuDisabled({ index, id }) {
    if (index <= 0) return false;
    if (index > 0 && !selectedType) return true;
    if (selectedVariant || selectedType) {
      return restrictedOptions?.find((opt) => opt === parseInt(id));
    }
  }

  const getValue = (id, val1, val2, val3) =>
    id === 0 ? val1 : id === 1 ? val2 : val3;

  const getOptionSetter = (menuId) =>
    getValue(menuId, setSelectedType, setSelectedVariant, setSelectedTopping);

  const getOptionValue = (menuId) =>
    getValue(menuId, selectedType, selectedVariant, selectedToping);

  const getTypeLabel = (menuId) =>
    getValue(menuId, "Select type", "Select Variant", "Select Toppings");

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
          const menuType = getTypeLabel(index);
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
