package tools

import "golang.org/x/text/unicode/norm"

func FixUnicode(in string) string {
	return norm.NFC.String(in)
}
