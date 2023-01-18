<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Contracts\Support\Responsable;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Excel;
use DB;
use Maatwebsite\Excel\Concerns\FromArray;

class UnadevListExport implements WithHeadings,FromArray
{
    /**
    * @return \Illuminate\Support\Collection
    */
    use Exportable;
    public function __construct($data)
    {
        $this->data = $data;
        //dd($this->data);
    }
    
   
    public function array(): array
    {
        return $this->data;
    }

    public function headings():array {
        return [

            'entry_date',
            'call_date',
            'phone_number',
            'status',
            'duree',
            'agent',
            'first_name',
            'last_name',
            'alt_phone',
            'address1',
            'postal_code',
            'city',
            'comments',
        ];
    }
}

