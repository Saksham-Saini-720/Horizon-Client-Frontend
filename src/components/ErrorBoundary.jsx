
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Kuch galat ho gaya!</h2>
          <button onClick={() => window.location.href = "/"}>
            Home pe jao
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}