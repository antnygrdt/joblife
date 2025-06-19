import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      document.body.style.height = '350px';

      return (
        <div className='error-boundary' style={{ height: '350px' }}>
          <div className='main'>
            <div className='icons'>
              <img src="assets/icones/error.png" alt="Erreur" />
            </div>
            <h1>OOPS!</h1>
            <h2>Une erreur inconnue est survenue</h2>

            <button onClick={() => this.setState({ hasError: false })}>Redémarrer la page</button>
          </div>

          <div className='footer'>
            <p>Si vous n'arrivez pas à résoudre ce problème, contactez <a href="https://x.com/tsuyobnha" target='_blank'>@tsuyobnha</a> sur X.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
