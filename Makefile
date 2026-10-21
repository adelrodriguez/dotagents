.PHONY: sync

sync:
	apm install --global --frozen
	apm compile --global
