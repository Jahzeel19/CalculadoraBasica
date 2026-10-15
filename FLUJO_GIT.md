# Quién sube qué (flujo de Git)

Somos 4. Cada quien trabaja en su rama y luego hace pull request a `main`.
Orden recomendado: DevOps (base del proyecto), Back, Front y al final Tester.

## DevOps
git checkout -b chore/configuracion-ci
git add package.json .gitignore .github/workflows/tests.yml README.md FLUJO_GIT.md
git commit -m "chore: agrega configuracion del proyecto, README y pipeline de pruebas en GitHub Actions"
git push origin chore/configuracion-ci

## Back
git checkout -b feature/logica-calculadora
git add js/calculadora.js
git commit -m "feat(math): agrega logica de operaciones y division entre cero (HU-01, HU-02)"
git push origin feature/logica-calculadora

## Front
git checkout -b feature/interfaz
git add index.html css/style.css js/ui.js
git commit -m "feat(ui): agrega interfaz, ventanas de error y ayuda, y teclado (HU-02 a HU-05)"
git push origin feature/interfaz

## Tester
git checkout -b test/pruebas-unitarias
git add tests/calculadora.test.js
git commit -m "test: agrega pruebas unitarias con Jest de la logica"
git push origin test/pruebas-unitarias

Nota: el pipeline de GitHub Actions se pone en verde cuando ya están subidos la lógica (Back) y las pruebas (Tester).
