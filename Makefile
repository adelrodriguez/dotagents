.PHONY: install sync private-skills

install:
	scripts/install.sh

sync:
	scripts/sync.sh

private-skills:
	scripts/install-private-skills.sh
