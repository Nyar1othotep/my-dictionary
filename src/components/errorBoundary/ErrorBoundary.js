import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
   constructor(props) {
      super(props);
   }

   state = {
      error: false,
   };

   componentDidCatch(error, errorInfo) {
      this.setState({ error: true });
   }

   render() {
      const { styles } = this.props;

      if (this.state.error) {
         return <ErrorMessage styles={styles} />;
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
