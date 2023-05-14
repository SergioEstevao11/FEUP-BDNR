from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
import pandas as pd
from progress.bar import Bar


def upload_vertices(data_frame, graph, label):
    vertices = []
    bar = Bar(label, max=data_frame.shape[0])
    for i,row in data_frame.iterrows():
        bar.next()
        vertex = graph.addV(label)
        for col in data_frame.columns:
            vertex = vertex.property(col,row[col])
            
        vertices.append((row['id'], vertex.next()))
    bar.finish()
    return vertices

def find_vertex(vertices, id):
    for vertex in vertices:
        if vertex[0] == id:
            return vertex
    return None



def upload_edges(df, in_column, out_column, in_list, out_list, g, label):
    edges = []
    bar = Bar(label, max=df.shape[0])
    for _, row in df.iterrows():
        bar.next()
        in_id = row[in_column]
        out_id = row[out_column]
        in_vertex = find_vertex(in_list, in_id)
        out_vertex = find_vertex(out_list, out_id)
        print("in:", in_vertex)
        print("out:",out_vertex)



        if in_vertex is None or out_vertex is None:
            continue

        #edge = g.addE(label).from_(in_vertex[1]).to(out_vertex[1]).next()
        v1 = g.V().has('id',in_id).next()
        v2 = g.V().has('id',out_id).next()

        print("v1:",v1)
        print("v2:",v2)


        g.V(v2).addE('knows').to(v1).iterate()

        #print("edge1:", edge)
        # for column in df.columns:
        #     if column in (in_column, out_column) or pd.isna(row[column]):
        #         continue
        #     edge = edge.property(column, row[column])
   
        #edges.append(edge.next())
        

   

        print("appended")
        # edge = g.addE(label).from_(out_vertex[1]).to(in_vertex[1])
        # for column in df.columns:
        #     if column in (in_column, out_column) or pd.isna(row[column]):
        #         continue
        #     edge = edge.property(column, row[column])
        # edges.append(edge.next())
    bar.finish()
    return edges


def main():

    royals = pd.read_csv('../../data/processed_data/royals_processed.csv')
    countries = pd.read_csv('../../data/processed_data/countries_processed.csv')
    #related_with = pd.read_csv('../../data/processed_data/related_with_processed.csv')
    #conflicts = pd.read_csv('../../data/processed_data/conflicts_processed.csv')
    #wars = pd.read_csv('../../data/processed_data/wars_processed.csv')

    ruled = pd.read_csv('../../data/processed_data/ruled_processed.csv')
    #participated_in = pd.read_csv('../../data/processed_data/participated_in_processed.csv')
    #part_of = pd.read_csv('../../data/processed_data/part_of_processed.csv')
    #load movies and fill in the missing values with empty strings
     

    # movies = pd.read_csv('../../data/processed_data/movies.csv')
    # person = pd.read_csv('../../data/processed_data/person.csv')
    # cast = pd.read_csv('../../data/processed_data/cast.csv')

    g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))

    g.V().drop().iterate()

    print(g.V().toList())
    
    royals = upload_vertices(royals,g,"Royal")
    countries = upload_vertices(countries,g,"Country")
    # wars = upload_vertices(wars,g,"War")
    # conflicts = upload_vertices(conflicts,g,"Conflict")


    # fathers = upload_edges(related_with,"child",royals,"father",royals,g,"related_with","type","father")
    # mothers = upload_edges(related_with,"child",royals,"mother",royals,g,"related_with","type","mother")

    ruled_by = upload_edges(ruled,"person_id","country_id",royals,countries,g,"ruled_by")

    # participated_in = upload_edges(participated_in,'country_id',countries,'conflict_id',conflicts,g,"participated_in",None,None)
    # part_of = upload_edges(part_of,'conflict_id',conflicts,'war_id',wars,g,"part_of",None,None)

    #print(ruled_by)

    print(g.V().toList())
    

    

if __name__ == '__main__':
    main()