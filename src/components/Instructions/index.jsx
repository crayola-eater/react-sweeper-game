import React from "react";

export default function Instructions() {
  return (
    <div className="instructions">
      <h3>Instructions</h3>
      <p>
        You are presented with a board of squares. Some squares contain zombies,
        others don't. If you click on a square containing a zombie, you lose. If
        you manage to click all the squares (without clicking on any zombies) or
        flag all the zombies, you win.
      </p>
      <p>
        Clicking a square which doesn't have a zombie reveals the number of
        neighbouring squares containing zombies. Use this information plus some
        guess work to avoid the zombies.
      </p>
      <p>
        To open a square, point at the square and click on it. To mark a square
        you think is a zombie, point and right-click.
      </p>
    </div>
  );
}
