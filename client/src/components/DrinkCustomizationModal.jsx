import PropTypes from "prop-types";
import { useState, useMemo } from "react";

const DrinkCustomizationModal = ({ drink, onClose, onConfirm }) => {
  const [customizations, setCustomizations] = useState({
    milk: "",
    sweetness: "",
    toppings: [],
    caramel: "",
    whippedCream: "",
    ice: "",
    espresso: "",
    chocolate: "",
  });

  const toggleTopping = (topping) => {
    setCustomizations((prev) => {
      const exists = prev.toppings.includes(topping);
      return {
        ...prev,
        toppings: exists
          ? prev.toppings.filter((t) => t !== topping)
          : [...prev.toppings, topping],
      };
    });
  };

  const handleChange = (key, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const calculateAdditionalCost = useMemo(() => {
    let cost = 0;
    const addCost = (condition) => (condition ? 10 : 0);

    if (drink.name === "Iced Blended Caramel Frappe") {
      cost += addCost(
        customizations.milk && customizations.milk !== "Whole milk"
      );
      cost += addCost(
        customizations.sweetness && customizations.sweetness !== "Regular"
      );
      cost += addCost(
        customizations.ice && customizations.ice !== "Regular ice"
      );
      cost += addCost(
        customizations.caramel &&
          customizations.caramel !== "Extra caramel drizzle"
      );
      cost += addCost(
        customizations.whippedCream &&
          customizations.whippedCream !== "With whipped cream"
      );
      cost += customizations.toppings.length * 10;
    }

    if (drink.name === "Cafe Mocha Madness") {
      cost += addCost(
        customizations.milk && customizations.milk !== "Whole milk"
      );
      cost += addCost(
        customizations.espresso && customizations.espresso !== "Double shot"
      );
      cost += addCost(
        customizations.sweetness && customizations.sweetness !== "Regular"
      );
      cost += addCost(
        customizations.chocolate &&
          customizations.chocolate !== "Dark chocolate"
      );
      cost += customizations.toppings.length * 10;
    }

    return cost;
  }, [customizations, drink.name]);

  const handleSubmit = () => {
    const totalPrice = drink.price + calculateAdditionalCost;
    const customizationKey = JSON.stringify(customizations); // to uniquely identify customized version
    onConfirm?.({
      ...drink,
      customizations,
      customizationKey,
      price: totalPrice,
    });
  };

  const Select = ({ label, value, onChange, children }) => (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <select
        className="w-full border rounded p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {children}
      </select>
    </div>
  );

  Select.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  const ToppingSelector = ({ label, options }) => (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((topping) => (
          <button
            key={topping}
            type="button"
            onClick={() => toggleTopping(topping)}
            className={`border px-3 py-1 rounded ${
              customizations.toppings.includes(topping)
                ? "bg-maroon text-white"
                : "bg-gray-100"
            }`}
          >
            {topping}
          </button>
        ))}
      </div>
    </div>
  );

  ToppingSelector.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  const renderOptions = () => {
    if (drink.name === "Iced Blended Caramel Frappe") {
      return (
        <>
          <Select
            label="Milk Options"
            value={customizations.milk}
            onChange={(val) => handleChange("milk", val)}
          >
            <option>Whole milk</option>
            <option>Skim milk</option>
            <option>Soy milk</option>
            <option>Almond milk</option>
            <option>Oat milk</option>
          </Select>

          <Select
            label="Sweetness Level"
            value={customizations.sweetness}
            onChange={(val) => handleChange("sweetness", val)}
          >
            <option>Regular</option>
            <option>Less sweet</option>
            <option>No added sugar</option>
          </Select>

          <Select
            label="Ice Level"
            value={customizations.ice}
            onChange={(val) => handleChange("ice", val)}
          >
            <option>Regular ice</option>
            <option>Extra ice</option>
          </Select>

          <Select
            label="Caramel Options"
            value={customizations.caramel}
            onChange={(val) => handleChange("caramel", val)}
          >
            <option>Extra caramel drizzle</option>
            <option> Regular caramel</option>
            <option>Caramel on the bottom only</option>
          </Select>

          <Select
            label="Whipped Cream"
            value={customizations.whippedCream}
            onChange={(val) => handleChange("whippedCream", val)}
          >
            <option>With whipped cream</option>
            <option>chocolate whipped cream</option>
            <option>vanilla whipped cream</option>
          </Select>

          <ToppingSelector
            label="Toppings"
            options={[
              "Crushed caramel toffee bits",
              "Chocolate chips",
              "Cinnamon dust",
            ]}
          />
        </>
      );
    }

    if (drink.name === "Cafe Mocha Madness") {
      return (
        <>
          <Select
            label="Milk Choices"
            value={customizations.milk}
            onChange={(val) => handleChange("milk", val)}
          >
            <option>Whole milk</option>
            <option>Soy milk</option>
            <option>Almond milk</option>
            <option>Oat milk</option>
          </Select>

          <Select
            label="Espresso Strength"
            value={customizations.espresso}
            onChange={(val) => handleChange("espresso", val)}
          >
            <option>Single shot (light)</option>
            <option>Double shot</option>
            <option>Extra shot (strong)</option>
          </Select>

          <Select
            label="Sweetness Level"
            value={customizations.sweetness}
            onChange={(val) => handleChange("sweetness", val)}
          >
            <option>Regular</option>
            <option>Less sweet</option>
            <option>Sugar-free</option>
          </Select>

          <Select
            label="Chocolate Flavor"
            value={customizations.chocolate}
            onChange={(val) => handleChange("chocolate", val)}
          >
            <option>Dark chocolate</option>
            <option>Milk chocolate</option>
            <option>White chocolate</option>
          </Select>

          <ToppingSelector
            label="Toppings"
            options={[
              "Whipped cream",
              "Chocolate drizzle",
              "Cocoa powder dusting",
            ]}
          />
        </>
      );
    }

    return (
      <p className="text-gray-500">
        No customization available for this drink.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4">Customize: {drink.name}</h2>

        {renderOptions()}

        <div className="text-right text-gray-700 font-medium mt-4">
          Additional Cost: ₹{calculateAdditionalCost}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-maroon text-white hover:bg-dark-brown"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

DrinkCustomizationModal.propTypes = {
  drink: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default DrinkCustomizationModal;
