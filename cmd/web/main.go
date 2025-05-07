package main

import (
	"syscall/js"
)

func add(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return 0
	}
	a := args[0].Float()
	b := args[1].Float()
	return a + b
}

func sub(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return 0
	}
	a := args[0].Float()
	b := args[1].Float()
	return a - b
}

func mul(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return 0
	}
	a := args[0].Float()
	b := args[1].Float()
	return a * b
}

func div(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return "NaN"
	}
	a := args[0].Float()
	b := args[1].Float()
	if b == 0 {
		return "∞"
	}
	return a / b
}

func registerCallbacks() {
	js.Global().Set("goAdd", js.FuncOf(add))
	js.Global().Set("goSub", js.FuncOf(sub))
	js.Global().Set("goMul", js.FuncOf(mul))
	js.Global().Set("goDiv", js.FuncOf(div))
}

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	<-c
}
