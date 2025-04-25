const ToggleOptions = ({
  cheatDayEnabled,
  specialPlaceEnabled,
  isAdvancedDraw,
  onCheatToggle,
  onSpecialToggle,
  onAdvancedToggle,
}) => (
  <div className="simple-draw__toggles">
    <label>
      <input
        type="checkbox"
        checked={cheatDayEnabled}
        onChange={onCheatToggle}
      />
      Cheat Day 🍕
    </label>
    <label>
      <input
        type="checkbox"
        checked={specialPlaceEnabled}
        onChange={onSpecialToggle}
      />
      Miejsca Specjalne 🎯
    </label>
    <label>
      <input
        type="checkbox"
        checked={isAdvancedDraw}
        onChange={onAdvancedToggle}
      />
      Zaawansowane losowanie 🧠
    </label>
  </div>
);

export default ToggleOptions;
