all:
	@echo '## Make commands ##'
	@echo
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | xargs

define info_bold
	$(info $(shell tput bold)$(1)$(shell tput sgr0))
endef

install:
ifeq (, $(shell which npm))
	$(call info_bold,==> Installing npm command)
	@brew install npm
endif
	$(call info_bold,==> Installing npm packages)
	@npm install

server: install browserify
	$(call info_bold,==> Running HTTP server)
	@python3 -m http.server

browserify: install
	$(call info_bold,==> Browserifying JS files)
	@for f in js/*.js; do npx browserify $${f} -o dist/$${f}; done
