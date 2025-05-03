import React from "react";

class ErrorBoundary extends React.Component {
    state = {hasError : false}

    
    static getDerivedStateFromError(error){
        alert("TEST")
        return {hasError: true}
    }

    componentDidCatch(error, info) {
        console.log("errr", error, info)
    }

    render() {
        if(this.state.hasError) {
            return <h1>Something went wrong</h1>
        }
        return this.props.children
    }
}
export default ErrorBoundary