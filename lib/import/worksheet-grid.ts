import type {
  CellAddress,
  CellObject,
  Range,
  StrictWS,
  WorkSheet,
} from "xlsx";
import type { SpreadsheetCellValue } from "./date";

type EncodeCell = (cell: CellAddress) => string;
type DecodeRange = (range: string) => Range;

export class WorksheetGrid {
  readonly maxRow: number;
  readonly maxColumn: number;
  private readonly cells: StrictWS;

  constructor(
    readonly name: string,
    sheet: WorkSheet,
    private readonly encodeCell: EncodeCell,
    decodeRange: DecodeRange,
  ) {
    this.cells = sheet as StrictWS;
    const reference = sheet["!ref"];
    if (reference === undefined) {
      this.maxRow = -1;
      this.maxColumn = -1;
      return;
    }

    const range = decodeRange(reference);
    this.maxRow = range.e.r;
    this.maxColumn = range.e.c;
  }

  address(row: number, column: number): string {
    return this.encodeCell({ r: row, c: column });
  }

  cell(row: number, column: number): CellObject | undefined {
    return this.cells[this.address(row, column)];
  }

  value(row: number, column: number): SpreadsheetCellValue {
    return this.cell(row, column)?.v;
  }

  row(row: number): SpreadsheetCellValue[] {
    const values: SpreadsheetCellValue[] = [];
    for (let column = 0; column <= this.maxColumn; column += 1) {
      values.push(this.value(row, column));
    }
    return values;
  }
}
