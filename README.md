# Create Release Branch GitHub Action

This action creates a new branch with the same commit reference as the branch it is being ran on, or your chosen reference when specified.

## Inputs

### `baseNumber`

**Optional** the number to start release with for example here baseNumber 3 `"release-3"`.

### `numberOfWeeks`

**Optional** create release branch on each number of weeks. default value is 2

### `baseDate`

base date to check if specific number of weeks are passed

## Outputs

### `created`

Boolean value representing whether or not a new branch was created.

## Example usage

```
uses: TheEhsanSarshar/action-create-release-base-on-week

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  baseNumber: 17
  baseDate: '2022-04-07'
  numberOfWeeks: 2
```
