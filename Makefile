.PHONY: sync

sync:
	apm install --global
	apm prune
	apm compile --global
